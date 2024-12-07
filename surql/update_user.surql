<record<user>> $user;
<option<string>> $name;
<string> $email;
<option<string>> $image;
UPDATE $user SET
    name = $name,
    email = $email,
    image = $image