# 🏗️ Clean Architecture Documentation

## Overview
This document describes the refactored clean architecture of the AI Resume Analyzer application, following industry best practices for maintainability, scalability, and testability.

---

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── services/
│   │   ├── base_service.py          # Base service class
│   │   ├── gemini_service.py        # AI service
│   │   ├── nlp_engine.py            # NLP processing
│   │   └── parser.py                # Resume parsing
│   ├── routes/
│   │   ├── resume.py                # Resume endpoints
│   │   ├── gemini_routes.py         # AI endpoints
│   │   └── advanced_features.py    # Advanced features
│   ├── models/
│   │   └── schemas.py               # Pydantic models
│   ├── db/
│   │   └── mongodb.py               # Database connection
│   ├── core/
│   │   └── config.py                # Configuration
│   └── utils/
│       └── skills_db.py             # Skills database
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── shared/              # Reusable components
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Button.jsx
    │   │   │   ├── Alert.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── UIComponents.jsx
    │   │   │   └── index.js
    │   │   └── dashboard/           # Feature components
    │   │       ├── ResumeOptimizer.jsx
    │   │       ├── InterviewPrep.jsx
    │   │       ├── ExplainableAI.jsx
    │   │       ├── VersionControl.jsx
    │   │       └── QualityCheck.jsx
    │   ├── hooks/
    │   │   └── index.js             # Custom hooks
    │   ├── services/
    │   │   └── api.js               # API client
    │   └── utils/
    │       ├── helpers.js           # Utility functions
    │       └── constants.js         # Constants
    └── ...
```

---

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **Services**: Business logic and AI integration
- **Routes**: HTTP request handling
- **Models**: Data validation and schemas
- **Components**: UI presentation
- **Hooks**: Reusable stateful logic
- **Utils**: Pure utility functions

### 2. **DRY (Don't Repeat Yourself)**
- Reusable components library
- Custom hooks for common patterns
- Utility functions for repeated operations
- Base classes for shared functionality

### 3. **Single Responsibility**
- Each component has one clear purpose
- Services handle specific domains
- Utilities perform single operations

### 4. **Dependency Injection**
- Database connections passed via FastAPI Depends
- Services initialized as singletons
- Props passed explicitly to components

### 5. **Error Handling**
- Centralized error handling in base service
- Consistent error response format
- User-friendly error messages

---

## 🔧 Backend Architecture

### Base Service Pattern

All services extend `BaseService` for consistency:

```python
from services.base_service import BaseService, ValidationError

class MyService(BaseService):
    async def validate_input(self, **kwargs) -> bool:
        # Validation logic
        pass
    
    async def process(self, data):
        try:
            # Validate
            await self.validate_input(**data)
            
            # Process
            result = await self._do_work(data)
            
            # Return success
            return self.create_success_response(result)
            
        except ValidationError as e:
            return self.handle_error(e, "Validation")
        except Exception as e:
            return self.handle_error(e, "Processing")
```

### Validation Utilities

```python
from services.base_service import (
    validate_required_fields,
    validate_text_length,
    sanitize_text
)

# Validate required fields
validate_required_fields(data, ['resume_id', 'job_description'])

# Validate text length
validate_text_length(text, min_length=100, max_length=5000)

# Sanitize input
clean_text = sanitize_text(user_input)
```

### Error Response Format

```python
{
    "success": False,
    "error": "Error message",
    "context": "Where error occurred"
}
```

### Success Response Format

```python
{
    "success": True,
    "message": "Success message",
    "data": { ... }
}
```

---

## ⚛️ Frontend Architecture

### Shared Components

#### Modal Component
```javascript
import { Modal } from '@/components/shared';

<Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Feature Title"
    subtitle="Description"
    icon={IconComponent}
    iconColor="primary"
    maxWidth="4xl"
>
    {/* Content */}
</Modal>
```

#### Button Component
```javascript
import { Button } from '@/components/shared';

<Button
    variant="primary"      // primary, secondary, success, danger, outline, ghost
    size="md"             // sm, md, lg
    loading={isLoading}
    disabled={isDisabled}
    icon={IconComponent}
    fullWidth
    onClick={handleClick}
>
    Button Text
</Button>
```

#### Alert Component
```javascript
import { Alert } from '@/components/shared';

<Alert
    type="error"          // error, success, warning, info
    title="Error Title"
    message="Error message"
    onClose={handleClose}
/>
```

#### Card Component
```javascript
import { Card } from '@/components/shared';

<Card
    title="Card Title"
    subtitle="Subtitle"
    icon={IconComponent}
    variant="default"     // default, primary, success, warning, danger, info
>
    {/* Content */}
</Card>
```

#### UI Components
```javascript
import {
    LoadingSpinner,
    EmptyState,
    Badge,
    ProgressBar,
    Input,
    Textarea,
    Tabs
} from '@/components/shared';

// Loading
<LoadingSpinner size="md" message="Loading..." />

// Empty state
<EmptyState
    icon={IconComponent}
    title="No Data"
    message="Nothing to show"
    action={<Button>Action</Button>}
/>

// Badge
<Badge variant="success" size="md">Label</Badge>

// Progress bar
<ProgressBar value={75} max={100} color="primary" showLabel />

// Input
<Input
    label="Label"
    value={value}
    onChange={handleChange}
    placeholder="Placeholder"
    error={error}
    icon={IconComponent}
    required
/>

// Textarea
<Textarea
    label="Label"
    value={value}
    onChange={handleChange}
    rows={10}
    required
/>

// Tabs
<Tabs
    tabs={[
        { id: 'tab1', label: 'Tab 1', icon: Icon, color: 'blue', count: 5 }
    ]}
    activeTab={activeTab}
    onChange={setActiveTab}
/>
```

---

## 🪝 Custom Hooks

### useApi Hook
```javascript
import { useApi } from '@/hooks';
import { optimizeResume } from '@/services/api';

const MyComponent = () => {
    const { data, loading, error, execute, reset } = useApi(optimizeResume);
    
    const handleOptimize = async () => {
        try {
            const result = await execute(resumeId, jobDesc, company);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <Alert type="error" message={error} />}
            {data && <div>{/* Display data */}</div>}
            <Button onClick={handleOptimize} loading={loading}>
                Optimize
            </Button>
        </>
    );
};
```

### useForm Hook
```javascript
import { useForm } from '@/hooks';

const MyForm = () => {
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setErrors,
        reset
    } = useForm(
        { name: '', email: '' },  // Initial values
        async (values) => {        // Submit handler
            await submitForm(values);
        }
    );
    
    return (
        <form onSubmit={handleSubmit}>
            <Input
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                error={touched.name && errors.name}
            />
            <Button type="submit" loading={isSubmitting}>
                Submit
            </Button>
        </form>
    );
};
```

### useModal Hook
```javascript
import { useModal } from '@/hooks';

const MyComponent = () => {
    const { isOpen, modalData, open, close } = useModal();
    
    return (
        <>
            <Button onClick={() => open({ id: 123 })}>
                Open Modal
            </Button>
            
            {isOpen && (
                <Modal isOpen={isOpen} onClose={close}>
                    {/* Use modalData */}
                </Modal>
            )}
        </>
    );
};
```

### useToast Hook
```javascript
import { useToast } from '@/hooks';

const MyComponent = () => {
    const { toasts, success, error, warning, info } = useToast();
    
    const handleAction = async () => {
        try {
            await doSomething();
            success('Action completed!');
        } catch (err) {
            error('Action failed!');
        }
    };
    
    return (
        <>
            {toasts.map(toast => (
                <Alert key={toast.id} type={toast.type} message={toast.message} />
            ))}
            <Button onClick={handleAction}>Do Something</Button>
        </>
    );
};
```

---

## 🛠️ Utility Functions

### Date Formatting
```javascript
import { formatDate, formatDateTime, getRelativeTime } from '@/utils/helpers';

formatDate(new Date());              // "Jan 23, 2026"
formatDateTime(new Date());          // "Jan 23, 2026, 11:30 PM"
getRelativeTime(new Date());         // "2 hours ago"
```

### Text Utilities
```javascript
import {
    truncateText,
    capitalizeWords,
    snakeToTitle
} from '@/utils/helpers';

truncateText("Long text...", 50);    // "Long text..."
capitalizeWords("hello world");      // "Hello World"
snakeToTitle("snake_case_text");     // "Snake Case Text"
```

### Color Utilities
```javascript
import {
    getScoreColor,
    getScoreBgColor,
    getSeverityColors
} from '@/utils/helpers';

getScoreColor(85);                   // "text-blue-400"
getScoreBgColor(85);                 // "bg-blue-500"
getSeverityColors('high');           // { text, bg, border }
```

### File Operations
```javascript
import { downloadFile, copyToClipboard } from '@/utils/helpers';

downloadFile(content, 'resume.txt', 'text/plain');
await copyToClipboard('Text to copy');
```

---

## 📊 Constants

### Using Constants
```javascript
import {
    SCORE_THRESHOLDS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION
} from '@/utils/constants';

// Score thresholds
if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    // Excellent score
}

// Error messages
throw new Error(ERROR_MESSAGES.NETWORK_ERROR);

// Success messages
toast.success(SUCCESS_MESSAGES.UPLOAD_SUCCESS);

// Validation
validate_text_length(text, VALIDATION.MIN_RESUME_LENGTH);
```

---

## 🧪 Testing Patterns

### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/shared';

test('Button renders and handles click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Hook Testing
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useModal } from '@/hooks';

test('useModal opens and closes', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
    
    act(() => {
        result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
        result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
});
```

---

## 🚀 Benefits of This Architecture

### Maintainability
✅ Clear separation of concerns  
✅ Consistent patterns throughout  
✅ Easy to locate and fix bugs  
✅ Self-documenting code structure

### Scalability
✅ Easy to add new features  
✅ Reusable components reduce duplication  
✅ Modular design allows parallel development  
✅ Performance optimizations are isolated

### Testability
✅ Pure functions are easy to test  
✅ Components have clear inputs/outputs  
✅ Mocking is straightforward  
✅ Integration tests are simplified

### Developer Experience
✅ Consistent API across components  
✅ Autocomplete support  
✅ Clear documentation  
✅ Reduced cognitive load

---

## 📝 Best Practices

### Component Design
1. Keep components small and focused
2. Use composition over inheritance
3. Props should be explicit and typed
4. Avoid prop drilling (use context if needed)
5. Extract reusable logic to hooks

### State Management
1. Keep state as local as possible
2. Lift state only when necessary
3. Use custom hooks for complex state
4. Avoid unnecessary re-renders

### Error Handling
1. Always handle errors gracefully
2. Provide user-friendly messages
3. Log errors for debugging
4. Use try-catch consistently

### Performance
1. Memoize expensive computations
2. Use lazy loading for routes
3. Optimize images and assets
4. Debounce user inputs

---

## 🔄 Migration Guide

### Migrating Existing Components

**Before:**
```javascript
const MyComponent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleClick = async () => {
        setLoading(true);
        try {
            await apiCall();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <button onClick={handleClick}>Click</button>
        </div>
    );
};
```

**After:**
```javascript
import { useApi } from '@/hooks';
import { Button, LoadingSpinner, Alert } from '@/components/shared';

const MyComponent = () => {
    const { loading, error, execute } = useApi(apiCall);
    
    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <Alert type="error" message={error} />}
            <Button onClick={execute} loading={loading}>
                Click
            </Button>
        </>
    );
};
```

---

## 📚 Additional Resources

- [React Best Practices](https://react.dev/learn)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
- [Component Design Patterns](https://www.patterns.dev/)

---

**Last Updated**: January 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✅
