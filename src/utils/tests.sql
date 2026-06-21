INSERT INTO "users" ("id", "avatar", "balance", "email", "full_name", "password", "role", "status", "username") VALUES

(10, 'avatar1', 10.00, 'login@example.com', 'Login Test User', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'loginTest'),
(3, 'avatar2', 0.00, 'logout@example.com', 'Logout Test User', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'logoutTest'),
(11, 'avatar2', 0.00, 'deposit@example.com', 'Deposit Test User', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'depositTest'),
(12, 'avatar2', 100.00, 'withdraw@example.com', 'Withdraw Test User', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'withdrawTest'),
(4, 'avatar3', 0.00, 'bob18@example.pt', 'bob18', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'bob18'),
(5, 'avatar4', 0.00, 'bob17@example.com', 'Bob Seventeen', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'bob17'),
(6, 'avatar5', 0.00, 'bob16@example.com', 'Bob Sixteen', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'bob16'),
(7, 'avatar1', 100.00, 'ricardo@example.com', 'Ricardo Oliveira', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'ricardo'),
(8, 'avatar1', 200.00, 'bob@example.com', 'Bob Trader', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'bob'),
(9, 'avatar1', 0.00, 'changerole@example.com', 'Role Test', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'changeRoleTest'),
(13, 'avatar1', 0.00, 'claimprize@example.com', 'Prize Test', '$2a$10$Ef2IfNuvyuLJ0R0chbNhjOtHSGeM8xFKn2nQqAnZo6bD6qeEK1Wau', 'USER', '0', 'claimprizetest');


INSERT INTO "events" ("id", "prediction", "date", "sport", "status", "home_team", "away_team") VALUES
(1, 'Both teams score', '2026-05-30 20:00:00', 'Football', 2, 'Real Madrid', 'Borussia Dortmund'),
(2, 'More than 2.5 goals', '2026-05-31 18:00:00', 'Football', 2, 'Sporting', 'Porto'),
(3, 'Home wins', '2026-06-01 21:00:00', 'Basket', 2, 'Lakers', 'Celtics'),
(4, 'Away wins', '2026-06-02 15:00:00', 'Tennis', 2, 'Alcaraz', 'Sinner'),
(5, 'Draw', '2026-06-03 19:45:00', 'Football', 2, 'Benfica', 'Braga'),
(6, 'More than 3.5 goals', '2026-06-04 22:00:00', 'Basket', 2, 'Warriors', 'Nets'),
(7, 'Home wins', '2026-06-05 14:00:00', 'Handball', 2, 'Barcelona', 'Kiel'),
(8, 'Both teams score', '2026-06-06 17:30:00', 'Football', 2, 'Man City', 'Man United'),
(9, 'Draw', '2026-06-07 20:30:00', 'Football', 2, 'Juventus', 'Milan'),
(10, 'Away wins', '2026-06-08 19:00:00', 'Tennis', 2, 'Nadal', 'Djokovic'),
(11, 'More than 1.5 goals', '2026-06-09 20:45:00', 'Football', 2, 'Arsenal', 'Chelsea'),
(12, 'Home wins', '2026-06-10 18:30:00', 'Basket', 2, 'Bulls', 'Knicks'),
(13, 'Both teams score', '2026-06-11 21:00:00', 'Football', 2, 'PSG', 'Marseille'),
(14, 'Draw', '2026-06-12 19:00:00', 'Football', 2, 'Atletico Madrid', 'Sevilla'),
(15, 'More than 2.5 goals', '2026-06-13 16:00:00', 'Football', 2, 'Bayern', 'Dortmund'),
(16, 'Away wins', '2026-06-14 20:00:00', 'Basket', 2, 'Miami Heat', 'Bucks'),
(17, 'Home wins', '2026-06-15 17:00:00', 'Handball', 2, 'Porto Handball', 'Benfica Handball'),
(18, 'Both teams score', '2026-06-16 19:30:00', 'Football', 2, 'Liverpool', 'Everton'),
(19, 'Draw', '2026-06-17 21:15:00', 'Football', 2, 'Inter', 'Juventus'),
(20, 'More than 3.5 goals', '2026-06-18 22:30:00', 'Basket', 2, 'Suns', 'Mavericks'),
(21, 'Home wins', '2026-06-19 15:00:00', 'Tennis', 2, 'Medvedev', 'Zverev'),
(22, 'Away wins', '2026-06-20 18:00:00', 'Football', 2, 'Roma', 'Lazio'),
(23, 'Both teams score', '2026-06-21 20:00:00', 'Football', 2, 'Lyon', 'Monaco'),
(24, 'Draw', '2026-06-22 19:45:00', 'Football', 2, 'Sporting B', 'Alverca'),
(25, 'More than 2.5 goals', '2026-06-23 21:00:00', 'Football', 2, 'Real Sociedad', 'Athletic Bilbao'),
(26, 'Draw', '2024-08-22 21:00:00', 'Football', 2, 'Delete', 'Event');

INSERT INTO "cards" ("id", "name", "rows", "cols", "line_prize", "bingo_prize", "price", "approved", "terminated", "date", "events_signature") VALUES
(1, 'Champions League Special 3x3', 3, 3, 15.00, 150.00, 2.00, true, false, '2026-05-27 22:00:00', '1-2-3-4-5-6-7-8-9'),
(2, 'Multi-Sport Weekend 3x3',       3, 3, 25.00, 250.00, 3.50, true, false, '2026-05-27 22:00:00', '10-11-12-13-14-15-16-17-18'),
(3, 'Edit Card Test',               4, 4, 50.00, 600.00, 5.00, true, false, '2026-05-27 22:00:00', '1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16'),
(4, 'Delete Card Test',             5, 5, 100.00, 1500.00, 10.00, true, false, '2026-05-27 22:00:00', '1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16-17-18-19-20-21-22-23-24-25');

INSERT INTO "card_events" ("card_id", "event_id") VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9),
(2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10), (3, 11), (3, 12), (3, 13), (3, 14), (3, 15), (3, 16),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10), (4, 11), (4, 12), (4, 13), (4, 14), (4, 15), (4, 16), (4, 17), (4, 18), (4, 19), (4, 20), (4, 21), (4, 22), (4, 23), (4, 24), (4, 25);


INSERT INTO "transactions" ("id", "amount", "claimed", "date", "type", "user_id") VALUES
(1, 50.00, false, '2026-06-18 23:00:00', 2, 13);

SELECT setval('users_seq', (SELECT MAX(id) FROM "users"));
SELECT setval('events_seq', (SELECT MAX(id) FROM "events"));
SELECT setval('cards_seq', (SELECT MAX(id) FROM "cards"));
SELECT setval('transactions_seq', (SELECT MAX(id) FROM "transactions"));