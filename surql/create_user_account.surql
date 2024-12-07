<record<user>> $user_id;
<string> $provider_id;
<string> $provider;
CREATE ONLY account CONTENT {
    user: $user_id,
    provider_id: $provider_id,
    provider: $provider,
}