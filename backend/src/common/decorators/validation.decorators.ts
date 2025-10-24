import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  defaultMessage(): string {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsSafeHtmlConstraint implements ValidatorConstraintInterface {
  validate(html: string): boolean {
    if (!html || typeof html !== 'string') {
      return true;
    }

    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b/gi,
      /<object\b/gi,
      /<embed\b/gi,
      /<form\b/gi,
      /<input\b/gi,
      /<meta\b/gi,
      /<link\b/gi,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(html));
  }

  defaultMessage(): string {
    return 'Content contains potentially unsafe HTML elements';
  }
}

export function IsSafeHtml(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeHtmlConstraint,
    });
  };
}

// Slug validator (URL-safe strings)
@ValidatorConstraint({ async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(slug: string): boolean {
    if (!slug || typeof slug !== 'string') {
      return false;
    }

    // Only lowercase letters, numbers, and hyphens, no consecutive hyphens
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
  }

  defaultMessage(): string {
    return 'Slug must be 3-50 characters long and contain only lowercase letters, numbers, and hyphens (no consecutive hyphens)';
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSlugConstraint,
    });
  };
}

// Safe URL validator with protocol restriction
@ValidatorConstraint({ async: false })
export class IsSafeUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments): boolean {
    if (!url || typeof url !== 'string') {
      return true; // Let other validators handle required/type validation
    }

    try {
      const urlObj = new URL(url);
      const allowedProtocols = args.constraints[0] || ['http:', 'https:'];
      return allowedProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const allowedProtocols = args.constraints[0] || ['http:', 'https:'];
    return `URL must use one of the following protocols: ${allowedProtocols.join(', ')}`;
  }
}

export function IsSafeUrl(allowedProtocols?: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedProtocols || ['http:', 'https:']],
      validator: IsSafeUrlConstraint,
    });
  };
}