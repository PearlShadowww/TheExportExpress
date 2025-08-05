import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
  };
}; 