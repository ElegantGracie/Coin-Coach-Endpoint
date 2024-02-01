const isTemporaryEmail = (email) => {
    const temporaryEmailProviders = [
        'yopmail.com',
        'guerrillamail.com',
        'tempmail.com',
        'mailinator.com',
        '10minutemail.com',
        'burnermail.io',
        'fakemailgenerator.com',
        'maildrop.cc',
        'getnada.com',
        'dispostable.com',
        'throwawaymail.com',
        'tempail.com',
        'mytemp.email',
        'mailnesia.com',
        'mailcatch.com',
        'mailnull.com',
        'moakt.com',
        'inboxalias.com',
        'spamgourmet.com',
        'anonemail.net',
    ];

    const domain = email.split('@')[1];
    return temporaryEmailProviders.some(provider => domain === provider);
}

module.exports = {
    isTemporaryEmail,
}