import {
  Condition,
  ConditionGroup,
  FieldCondition,
  Operator,
} from "../nodes-configuration/types";

/**
 * Evaluates a single condition against the form values.
 * @param condition - A single Condition object.
 * @param formValues - The current form values.
 * @returns Boolean indicating if the condition is met.
 */
function evaluateSingleCondition(
  condition: Condition,
  formValues: Record<string, any>,
): boolean {
  const fieldValue = formValues[condition.field];

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "not equals":
      return fieldValue !== condition.value;
    case "in":
      return (
        Array.isArray(condition.value) && condition.value.includes(fieldValue)
      );
    case "not in":
      return (
        Array.isArray(condition.value) && !condition.value.includes(fieldValue)
      );
    case "greater than":
      return typeof fieldValue === "number" && fieldValue > condition.value;
    case "less than":
      return typeof fieldValue === "number" && fieldValue < condition.value;
    case "exists":
      return fieldValue !== undefined && fieldValue !== null;
    case "not exists":
      return fieldValue === undefined || fieldValue === null;
    default:
      console.warn(`Unsupported operator: ${condition.operator}`);
      return false;
  }
}

/**
 * Recursively evaluates FieldCondition against the form values.
 * @param condition - A FieldCondition object (Condition or ConditionGroup).
 * @param formValues - The current form values.
 * @returns Boolean indicating if the condition is met.
 */
export function evaluateCondition(
  condition: FieldCondition | undefined,
  formValues: Record<string, any>,
): boolean {
  if (!condition) return true; // No condition means always show

  if ("logic" in condition && "conditions" in condition) {
    const { logic, conditions } = condition as ConditionGroup;

    if (!Array.isArray(conditions) || conditions.length === 0) {
      console.warn("ConditionGroup has no conditions.");
      return true;
    }

    const results = conditions.map((cond) =>
      evaluateCondition(cond, formValues),
    );

    if (logic === "AND") {
      return results.every(Boolean);
    } else if (logic === "OR") {
      return results.some(Boolean);
    } else {
      console.warn(`Unsupported logic operator: ${logic}`);
      return false;
    }
  }

  // It's a single Condition
  return evaluateSingleCondition(condition as Condition, formValues);
}
