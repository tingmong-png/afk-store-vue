export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    });
  }

  try {
    const { username } = await req.json();
    const cleanUsername = String(username || '')
      .trim()
      .replace(/^@/, '');

    if (!cleanUsername) {
      return new Response(
        JSON.stringify({ error: 'Please enter a username.' }),
        { status: 400 }
      );
    }

    const userResponse = await fetch(
      'https://users.roblox.com/v1/usernames/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernames: [cleanUsername],
          excludeBannedUsers: true,
        }),
      }
    );

    if (!userResponse.ok) {
      throw new Error('Roblox username search failed.');
    }

    const userData = await userResponse.json();
    const user = userData.data?.[0];

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Roblox account not found.' }),
        { status: 404 }
      );
    }

    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
    );

    if (!avatarResponse.ok) {
      throw new Error('Could not load Roblox avatar.');
    }

    const avatarData = await avatarResponse.json();
    const avatarUrl = avatarData.data?.[0]?.imageUrl || '';

    return new Response(
      JSON.stringify({
        id: user.id,
        username: user.name,
        displayName: user.displayName,
        avatarUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Lookup failed.' }),
      { status: 500 }
    );
  }
};
