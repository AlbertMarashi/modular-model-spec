<string> $provider_id;
<string> $provider;
SELECT id, user FROM account WHERE provider_id = $provider_id AND provider = $provider LIMIT 1