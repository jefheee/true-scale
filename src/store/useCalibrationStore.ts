import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Unit = 'cm' | 'in';

interface CalibrationState {
  ppi: number;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  calibrateByCreditCard: (cardWidthPixels: number) => void;
  calibrateByDiagonal: (screenWidth: number, screenHeight: number, diagonalInches: number) => void;
  resetCalibration: () => void;
}

// Default standard web PPI
const DEFAULT_PPI = 96.0;

// Credit card standard width is 85.6mm. In inches: 85.6 / 25.4
const CREDIT_CARD_WIDTH_INCHES = 85.6 / 25.4;

export const useCalibrationStore = create<CalibrationState>()(
  persist(
    (set) => ({
      ppi: DEFAULT_PPI,
      unit: 'cm',
      setUnit: (unit) => set({ unit }),
      calibrateByCreditCard: (cardWidthPixels) => {
        const ppi = cardWidthPixels / CREDIT_CARD_WIDTH_INCHES;
        set({ ppi });
      },
      calibrateByDiagonal: (screenWidth, screenHeight, diagonalInches) => {
        if (diagonalInches <= 0) return;
        const ppi = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) / diagonalInches;
        set({ ppi });
      },
      resetCalibration: () => set({ ppi: DEFAULT_PPI }),
    }),
    {
      name: 'truescale-calibration-storage',
    }
  )
);
