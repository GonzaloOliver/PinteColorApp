export interface ProofReturn {
    stock: 'NONE' | 'DISCOUNT' | 'ADD';
    always: boolean;
    debtAction: 'NONE' | 'ADD' | 'DEDUCT';
    afipNumber: boolean;
}