"""
Base service class for common functionality
Provides reusable patterns for all service classes
"""
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod


class BaseService(ABC):
    """
    Abstract base class for all services
    Enforces consistent patterns and provides common utilities
    """
    
    def __init__(self):
        self.name = self.__class__.__name__
    
    def log_info(self, message: str):
        """Log informational message"""
        print(f"[{self.name}] INFO: {message}")
    
    def log_error(self, message: str, error: Exception = None):
        """Log error message"""
        error_detail = f" - {str(error)}" if error else ""
        print(f"[{self.name}] ERROR: {message}{error_detail}")
    
    def log_warning(self, message: str):
        """Log warning message"""
        print(f"[{self.name}] WARNING: {message}")
    
    @abstractmethod
    async def validate_input(self, **kwargs) -> bool:
        """
        Validate input parameters
        Must be implemented by subclasses
        """
        pass
    
    def handle_error(self, error: Exception, context: str = "") -> Dict[str, Any]:
        """
        Standardized error handling
        Returns consistent error response format
        """
        self.log_error(f"{context}: {str(error)}", error)
        return {
            "success": False,
            "error": str(error),
            "context": context
        }
    
    def create_success_response(self, data: Any, message: str = "Success") -> Dict[str, Any]:
        """
        Create standardized success response
        """
        return {
            "success": True,
            "message": message,
            "data": data
        }


class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


class ServiceError(Exception):
    """Custom exception for service-level errors"""
    pass


def validate_required_fields(data: Dict[str, Any], required_fields: list) -> None:
    """
    Validate that all required fields are present and not empty
    
    Args:
        data: Dictionary to validate
        required_fields: List of required field names
    
    Raises:
        ValidationError: If any required field is missing or empty
    """
    missing_fields = []
    empty_fields = []
    
    for field in required_fields:
        if field not in data:
            missing_fields.append(field)
        elif not data[field] or (isinstance(data[field], str) and not data[field].strip()):
            empty_fields.append(field)
    
    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")
    
    if empty_fields:
        raise ValidationError(f"Empty required fields: {', '.join(empty_fields)}")


def validate_text_length(
    text: str, 
    min_length: int = 0, 
    max_length: int = None, 
    field_name: str = "text"
) -> None:
    """
    Validate text length
    
    Args:
        text: Text to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        field_name: Name of the field for error messages
    
    Raises:
        ValidationError: If text length is invalid
    """
    if not text:
        raise ValidationError(f"{field_name} cannot be empty")
    
    text_length = len(text.strip())
    
    if text_length < min_length:
        raise ValidationError(
            f"{field_name} must be at least {min_length} characters (got {text_length})"
        )
    
    if max_length and text_length > max_length:
        raise ValidationError(
            f"{field_name} must not exceed {max_length} characters (got {text_length})"
        )


def sanitize_text(text: str) -> str:
    """
    Sanitize text input
    Removes excessive whitespace and normalizes line breaks
    
    Args:
        text: Text to sanitize
    
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Normalize line breaks
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Remove excessive whitespace
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(line for line in lines if line)
    
    return text.strip()


def truncate_text(text: str, max_length: int = 1000, suffix: str = "...") -> str:
    """
    Truncate text to specified length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
    
    Returns:
        Truncated text
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix
