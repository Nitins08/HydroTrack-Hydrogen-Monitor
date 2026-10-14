/**
 * Reusable Framer Motion animation variants and helpers for HydroTrack.
 * Respects user's prefers-reduced-motion setting.
 */

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15 }
  }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const tableRowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

export const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.14 } }
};

export const modalContentVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 6,
    transition: { duration: 0.14 }
  }
};

export const toastVariants = {
  initial: { opacity: 0, x: 40, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.22, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.95,
    transition: { duration: 0.16 }
  }
};

export const buttonMotion = {
  whileHover: { y: -1, transition: { duration: 0.1 } },
  whileTap: { scale: 0.98, transition: { duration: 0.08 } }
};
