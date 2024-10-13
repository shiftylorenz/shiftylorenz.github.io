let roleMappings = {
    1: 'employee',
    2: 'management',
    3: 'admin'
}

function intToRole(r)
{
    return roleMappings[r] || 'N/A';
}

export function roleToInt(r)
{
    for (let role in roleMappings)
    {
        if (roleMappings[role] === r)
        {
            return role;
        }
    }

    return 0;
}

export function parseMemberData(data)
{
    return {
        userId: data.userId,
        username: data.username,
        role: intToRole(data.role)
    }
}