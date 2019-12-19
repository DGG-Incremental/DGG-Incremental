class Action {
    constructor (type, moneyAdded, incomeGained, cost, itemName) {
        this.type = type;
        this.moneyAdded = moneyAdded;
        this.incomeGained = incomeGained;
        this.cost = cost;
        this.itemName = itemName;
    }
}

export default Action;