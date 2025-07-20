// budgetStorage.js - Enhanced Version
const BUDGET_STORAGE_VERSION = '2.0';

function initializeStorage() {
    if (!localStorage.getItem('budgetStorageVersion')) {
        // Migrate old data if exists
        const oldHistory = JSON.parse(localStorage.getItem('budgetHistory')) || [];
        const oldGoals = JSON.parse(localStorage.getItem('budgetGoals')) || {};
        
        const newData = {
            version: BUDGET_STORAGE_VERSION,
            budgets: oldHistory,
            goals: oldGoals,
            templates: {},
            preferences: {
                currency: 'N$',
                theme: 'light',
                notifications: true
            }
        };
        
        localStorage.setItem('budgetData', JSON.stringify(newData));
        localStorage.setItem('budgetStorageVersion', BUDGET_STORAGE_VERSION);
        
        // Clean up old keys
        localStorage.removeItem('budgetHistory');
        localStorage.removeItem('budgetGoals');
    }
}

function getBudgetData() {
    initializeStorage();
    const data = JSON.parse(localStorage.getItem('budgetData')) || {
        version: BUDGET_STORAGE_VERSION,
        budgets: [],
        goals: {},
        templates: {},
        preferences: {
            currency: 'N$',
            theme: 'light',
            notifications: true
        }
    };
    return data;
}

function saveBudgetData(data) {
    localStorage.setItem('budgetData', JSON.stringify(data));
}

function saveBudgetToHistory(budgetData) {
    try {
        const data = getBudgetData();
        data.budgets.push(budgetData);
        saveBudgetData(data);
    } catch (e) {
        console.error("Error saving to history:", e);
    }
}

function getBudgetHistory() {
    try {
        return getBudgetData().budgets;
    } catch (e) {
        console.error("Error reading history:", e);
        return [];
    }
}

function setSavingsGoal(amount, budgetName) {
    try {
        const data = getBudgetData();
        data.goals[budgetName || 'default'] = amount;
        saveBudgetData(data);
    } catch (e) {
        console.error("Error saving goal:", e);
    }
}

function getSavingsGoal(budgetName) {
    try {
        return getBudgetData().goals[budgetName || 'default'];
    } catch (e) {
        console.error("Error reading goal:", e);
        return null;
    }
}

function saveBudgetTemplate(templateName, templateData) {
    try {
        const data = getBudgetData();
        data.templates[templateName] = templateData;
        saveBudgetData(data);
    } catch (e) {
        console.error("Error saving template:", e);
    }
}

function getBudgetTemplate(templateName) {
    try {
        return getBudgetData().templates[templateName];
    } catch (e) {
        console.error("Error reading template:", e);
        return null;
    }
}

function getAllTemplates() {
    try {
        return getBudgetData().templates;
    } catch (e) {
        console.error("Error reading templates:", e);
        return {};
    }
}

function setPreference(key, value) {
    try {
        const data = getBudgetData();
        data.preferences[key] = value;
        saveBudgetData(data);
    } catch (e) {
        console.error("Error setting preference:", e);
    }
}

function getPreference(key) {
    try {
        return getBudgetData().preferences[key];
    } catch (e) {
        console.error("Error getting preference:", e);
        return null;
    }
}

function deleteBudget(budgetId) {
    try {
        const data = getBudgetData();
        data.budgets = data.budgets.filter(budget => budget.date !== budgetId);
        saveBudgetData(data);
        return true;
    } catch (e) {
        console.error("Error deleting budget:", e);
        return false;
    }
}

function getBudgetById(budgetId) {
    try {
        const data = getBudgetData();
        return data.budgets.find(budget => budget.date === budgetId);
    } catch (e) {
        console.error("Error getting budget by ID:", e);
        return null;
    }
}

// Initialize storage when loaded
initializeStorage();