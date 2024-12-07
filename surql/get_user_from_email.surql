<string> $email;
SELECT id, name FROM user WHERE email = string::lowercase($email);