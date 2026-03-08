class StoreOrder {
    constructor({ id = 0, petId = 0, quantity = 0, shipDate, status = "placed", complete = true } = {}) {
        this.id = id;
        this.petId = petId;
        this.quantity = quantity;
        this.shipDate = shipDate || new Date().toISOString();
        this.status = status;
        this.complete = complete;
    }

    toPayload() {
        return {
            id: this.id,
            petId: this.petId,
            quantity: this.quantity,
            shipDate: this.shipDate,
            status: this.status,
            complete: this.complete
        };
    }
}

module.exports = { StoreOrder };
