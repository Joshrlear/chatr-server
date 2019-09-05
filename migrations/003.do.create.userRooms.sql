CREATE TABLE userRooms (
    user_id INTEGER REFERENCES users(id),
    rooms_id INTEGER REFERENCES rooms(id),
    PRIMARY KEY (user_id, rooms_id)
);