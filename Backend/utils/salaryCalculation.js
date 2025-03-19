export const employeeEPF = (basicSalary, percentage = 0.08) => {
    return basicSalary * percentage;
}

export const employerEPF = (basicSalary, percentage = 0.12) => {
    return basicSalary * percentage;
}

export const employerETF = (basicSalary, percentage = 0.03) => {
    return basicSalary * percentage;
}

export const calculateNetSalary = (basicSalary, epf) => {
    return basicSalary - epf;
}

export const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};