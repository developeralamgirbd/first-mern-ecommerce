const {faker} = require("@faker-js/faker");
const slugify = require("slugify");
const fs = require("fs");

exports.createRandomUser = () => {
    const userDocuments = []
    Array.from({ length: 100 }).forEach(() => {
        userDocuments.push({
            name: faker.name.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: 'Az@12345678',
            address: faker.address.streetAddress(true) ,
            role: 0,
        })
    });
    return userDocuments;

}

exports.createRandomCategory = function () {
    const documents = []
    Array.from({ length: 20 }).forEach((v, i) => {
        const category = faker.commerce.productMaterial()+i;
        documents.push({
            name: category,
            slug: slugify(category),
        })
    });
    return documents;
}
exports.createRandomProducts = function (category) {
    const documents = []
    Array.from({ length: 500 }).forEach((v, i) => {

        const productName = faker.commerce.productName()+i;
        documents.push({
            name: productName,
            slug: slugify(productName),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(10, 1200),
            category: category,
            quantity: 200,
            sold: 0,
            demoPhoto: faker.image.abstract(1234, 2345, true),
            shipping: false,
        })
    });
    return documents;
}

