export const validators = {
  /**
   * Email validation matching backend @Email annotation
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  /**
   * Password validation matching backend @Size(min = 8) annotation
   */
  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    return null;
  },

  /**
   * URL validation matching backend UrlValidator and @Pattern annotation
   */
  url: (url) => {
    if (!url) return 'URL is required';
    
    // Add protocol if missing (matches backend logic)
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url;
    }

    try {
      new URL(processedUrl);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  /**
   * Required field validation matching backend @NotBlank annotation
   */
  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  /**
   * Title validation matching backend @Size(max = 500) annotation
   */
  title: (title) => {
    if (title && title.length > 500) {
      return 'Title cannot exceed 500 characters';
    }
    return null;
  },

  /**
   * Description validation matching backend @Size(max = 1000) annotation
   */
  description: (description) => {
    if (description && description.length > 1000) {
      return 'Description cannot exceed 1000 characters';
    }
    return null;
  }
};