 {
    id: Number,
    description: String,
    itemName: String,
    dateOfListing: String, // ISO 8601
    location: {
        country: String,
        state: String,
        city: String
    },
    price: Number,
    categories: [],
    deliveryType: String,
    sellersName: String,
    sellersContactInfo: {
        phoneNumber: Number,
        email: String
    }
}