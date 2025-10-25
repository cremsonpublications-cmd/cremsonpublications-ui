-- Create a function to check if a user exists and if their email is confirmed
CREATE OR REPLACE FUNCTION check_user_exists(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record auth.users%ROWTYPE;
    result json;
BEGIN
    -- Look for the user in auth.users table
    SELECT * INTO user_record
    FROM auth.users
    WHERE email = user_email;

    IF FOUND THEN
        -- User exists, check if email is confirmed
        result := json_build_object(
            'user_exists', true,
            'email_confirmed', user_record.email_confirmed_at IS NOT NULL
        );
    ELSE
        -- User doesn't exist
        result := json_build_object(
            'user_exists', false,
            'email_confirmed', false
        );
    END IF;

    RETURN result;
END;
$$;