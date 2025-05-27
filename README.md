📱 Personal Finance Tracker Mobile App
🖥️ Screen Descriptions & API Endpoints
1. Welcome Screen (index.tsx)
Purpose: Introduce users to the app through an onboarding flow.Features:  

� carousel with 3 slides showcasing app features  
✨ Smooth animations and gradient backgrounds  
➡️ Skip/Next navigation buttonsNavigation: Leads to Login ScreenAPI Endpoints: None


2. Login Screen (login.tsx)
Purpose: Authenticate users to access the app.Features:  

📧 Email/password form with validation  
🚀 Demo account quick-fill buttons for testing  
⚠️ Error handling with retry options and clear messages  
⏳ Loading state indicators during authenticationNavigation: Success → Dashboard ScreenAPI Endpoints:  
GET /users?username=example@gmail.com (Validate username/password)


3. Dashboard Screen (index.tsx)
Purpose: Provide a financial overview for the user.Features:  

💰 Monthly spending summary in a gradient card  
📜 List of 5 most recent expenses  
⚡ Quick action buttons: Add Expense, View All Expenses  
📊 Spending charts (total spent, expense count, category breakdowns)  
🔄 Error states with refresh capabilityData: Aggregated expense data from APIStats: Total spent, expense count, category breakdownsNavigation:  
Add Expense → Add Expense Screen  
View All → Expenses List ScreenAPI Endpoints:  
GET /expenses (Fetch recent expenses and aggregate data)


4. Expenses List Screen (index.tsx)
Purpose: Display all user expenses with filtering options.Features:  

🔍 Searchable and filterable expense list  
🗑️ Swipe-to-delete functionality  
🔄 Pull-to-refresh to update data  
∅ Empty state handling (e.g., "No expenses yet")  
➕ Floating action button to add new expense  
🏷️ Category filtersNavigation:  
Expense item → Expense Detail Screen  
Floating button → Add Expense ScreenAPI Endpoints:  
GET /expenses (Retrieve all expenses)  
DELETE /expenses/{expenseId} (Delete expense)


5. Expense Detail Screen ([id].tsx)
Purpose: Show detailed information for a single expense.Features:  

💵 Large display of expense amount with category icon  
ℹ️ Complete details (amount, category, date, description)  
✏️ Edit and 🗑️ Delete action buttons  
⚠️ Error handling for missing/inaccessible expenses  
📅 Formatted dates with relative time (e.g., "2 days ago")  
🗑️ Delete requires confirmation dialogNavigation:  
Back to Expenses List Screen  
Edit → Add Expense Screen (pre-filled)API Endpoints:  
GET /expenses/{expenseId} (Fetch expense details)  
DELETE /expenses/{expenseId} (Delete expense)


6. Add Expense Screen (new.tsx)
Purpose: Allow users to create new expense entries.Features:  

📝 Form with validation for all fields  
🏷️ Category selection (dropdown or picker)  
📅 Date picker for expense date  
💲 Amount input with currency formatting  
✅ Real-time form validation with error messages  
📜 Description field for notesNavigation: Success → Expenses List ScreenAPI Endpoints:  
POST /expenses (Create new expense)


7. Settings Screen (settings.tsx)
Purpose: Manage app configuration and user settings.Features:  

👤 User profile display (name, email)  
🔔 Notification toggles for budget alerts  
🗑️ Cache management (e.g., clear cache)  
🔄 Pending sync operations status  
ℹ️ App version information  
🚪 Logout functionalitySections: Profile, Preferences, Data Management, AboutNavigation: Logout → Login ScreenAPI Endpoints: None


🛠️ Technical Specifications

Framework: React Native  
API Library: Axios for HTTP requests  
Validation: Real-time input validation with user-friendly error messages  
Error Handling: Handle API/network errors with retry options  
API Base URL: https://67ac71475853dfff53dab929.mockapi.io/api/v1

