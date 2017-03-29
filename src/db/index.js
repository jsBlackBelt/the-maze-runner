const Datastore = require('nedb');
const db = new Datastore({ filename: './dungeon.db', autoload: true });

// auto compact db every 30 minutes
db.persistence.setAutocompactionInterval(1800000);

module.exports.getDungeon = (key) => {
    return new Promise((resolve, reject) => {
        db.findOne({key: key}, (err, doc) => {
            if (err) {
                reject(err);
            }

            resolve(doc);
        });
    });
};

module.exports.saveDungeon = (dungeon) => {
    return new Promise((resolve, reject) => {
        db.insert(dungeon, (err, newDoc) => {
            if (err) {
                reject(err);
            }

            resolve({firstRoomId: newDoc.dungeon[0].id});
        });
    });
};

module.exports.updateLastVisitedRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$push: { lastVisitedRoomId: roomId }}, {}, (err, numUpdated) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Key + RoomId combination not unique!`));
            }

            resolve(roomId);
        });
    });
};

module.exports.updateNumberOfTries = (key) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$inc: {numOfValidationTries: 1}}, {returnUpdatedDocs: true}, (err, numUpdated, doc) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Number of tries not incremented`));
            }

            resolve(doc.numOfValidationTries);
        });
    });
};

module.exports.updateItem = (key, item) => {
    return new Promise((resolve, reject) => {
         db.update({key: key}, { $addToSet: {"dungeon.items": item} }, {returnUpdatedDocs: true}, (err, numUpdated, doc) => {
             if (err) {
                 reject(err);
             }

             if (numUpdated !== 1) {
                 reject(new Error(`Could not update item`));
             }

             resolve(doc.dungeon.items);
        });
    });
};