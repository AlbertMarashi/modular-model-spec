
-----------------
-- USER TABLE --
-----------------
DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT
            WHERE id = $auth
        FOR UPDATE
            # Allow users to update their own details
            WHERE id = $auth;

DEFINE FIELD name ON TABLE user TYPE string;
DEFINE FIELD email ON TABLE user TYPE string
    VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD created_at ON TABLE user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE user TYPE datetime VALUE time::now();
DEFINE FIELD image ON TABLE user TYPE option<string>;
# Users can have no password because of oauth
# Must be bcrypted
DEFINE FIELD password ON TABLE user TYPE option<string>
    # Disable users from changing or reading their password
    PERMISSIONS NONE;

DEFINE INDEX email_index ON TABLE user COLUMNS email UNIQUE;

-------------------
-- ACCOUNT TABLE --
-------------------
DEFINE TABLE account SCHEMAFULL;

DEFINE FIELD provider_id ON TABLE account TYPE string;
DEFINE FIELD provider ON TABLE account TYPE string;
DEFINE FIELD user ON TABLE account TYPE record<user>;

DEFINE INDEX search_by_user ON TABLE account COLUMNS user;
DEFINE INDEX search_by_provider ON TABLE account COLUMNS provider, provider_id;

----------------
-- USER SCOPE --
----------------
DEFINE SCOPE users;
-- This needs to be generated using `openssl rand -hex 32`
-- DEFINE TOKEN siteforge_token on SCOPE users type HS256 VALUE "RANDOM_SECRET_KEY_HEX";


DEFINE TABLE thread SCHEMAFULL
    PERMISSIONS
        FOR SELECT, UPDATE, CREATE, DELETE
            WHERE user = $auth;

DEFINE FIELD user ON TABLE thread TYPE record<user> DEFAULT $auth;
DEFINE FIELD allowed_formats ON TABLE thread TYPE array<object>;
DEFINE FIELD allowed_formats.* ON TABLE thread FLEXIBLE TYPE object;
DEFINE FIELD messages ON TABLE thread TYPE array<object>;
DEFINE FIELD messages.* ON TABLE thread FLEXIBLE TYPE object;
DEFINE FIELD created_at ON TABLE thread TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE thread TYPE datetime VALUE time::now();
DEFINE FIELD tags ON TABLE thread TYPE array<string> DEFAULT [];


----------------
-- TEMPORARY MIGRATION --
----------------
