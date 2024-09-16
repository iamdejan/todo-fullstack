CREATE TABLE todo_items (
    id VARCHAR(26) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    finished BOOLEAN NOT NULL DEFAULT FALSE
);
