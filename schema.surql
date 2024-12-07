-----------------
-- USER TABLE --
-----------------
DEFINE TABLE OVERWRITE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT
            WHERE id = $auth
        FOR UPDATE
            # Allow users to update their own details
            WHERE id = $auth;

DEFINE FIELD OVERWRITE name ON TABLE user TYPE string;
DEFINE FIELD OVERWRITE email ON TABLE user TYPE string
    VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD OVERWRITE created_at ON TABLE user TYPE datetime DEFAULT time::now();
DEFINE FIELD OVERWRITE updated_at ON TABLE user TYPE datetime VALUE time::now();
DEFINE FIELD OVERWRITE image ON TABLE user TYPE option<string>;
# Users can have no password because of oauth
# Must be bcrypted
DEFINE FIELD OVERWRITE password ON TABLE user TYPE option<string>
    # Disable users from changing or reading their password
    PERMISSIONS NONE;

DEFINE INDEX OVERWRITE email_index ON TABLE user COLUMNS email UNIQUE;

-------------------
-- ACCOUNT TABLE --
-------------------
DEFINE TABLE OVERWRITE account SCHEMAFULL;

DEFINE FIELD OVERWRITE provider_id ON TABLE account TYPE string;
DEFINE FIELD OVERWRITE provider ON TABLE account TYPE string;
DEFINE FIELD OVERWRITE user ON TABLE account TYPE record<user>;

DEFINE INDEX OVERWRITE search_by_user ON TABLE account COLUMNS user;
DEFINE INDEX OVERWRITE search_by_provider ON TABLE account COLUMNS provider, provider_id;

----------------
-- THREAD --
----------------


DEFINE TABLE OVERWRITE thread SCHEMAFULL
    PERMISSIONS
        FOR SELECT, UPDATE, CREATE, DELETE
            WHERE user = $auth;

DEFINE FIELD OVERWRITE user ON TABLE thread TYPE record<user> DEFAULT $auth;
DEFINE FIELD OVERWRITE allowed_formats ON TABLE thread FLEXIBLE  TYPE any;
DEFINE FIELD OVERWRITE messages ON TABLE thread FLEXIBLE TYPE any;
DEFINE FIELD OVERWRITE created_at ON TABLE thread TYPE datetime DEFAULT time::now();
DEFINE FIELD OVERWRITE updated_at ON TABLE thread TYPE datetime VALUE time::now();
DEFINE FIELD OVERWRITE tags ON TABLE thread TYPE array<string> DEFAULT [];


----------------
-- TEMPORARY MIGRATION --
----------------
