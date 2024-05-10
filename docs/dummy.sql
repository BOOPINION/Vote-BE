# Dummy Users (7)
INSERT INTO USER (NAME, EMAIL, PASSWORD, PASSWORD_SALT, STATUS)
VALUES
    # password: ADMIN_1
    ('ADMIN 1', 'admin@example.com',
    'vNwJAUkQ+rkg7T/am0tQY94Ov2S26rm0Cnirld2YGXHAaaH7xZneRJUtQO+WLDoiCf8LvaFxKs8pVPgduLk49gVUD36vxePYNZhPksQtA9raZzX2CdBZ1mevJ2GP0ff86Beynf0idS6J4gJpwCd16g7E9cA+6bgV5wvoS4yBQks=',
    '8iVm+NMDilw562iQoJCMYvtmNL6wKeqgo+Bs8o2C+mJv5XWDG2vgCQqaNRHLm25AHEoCH61rx0bJnrkyyQkKlQ==', 'ADMIN'),

    # password: USER_1
    ('USER 1', 'user1@example.com',
    'D+EZ3NWWIC/WVlDXIALbzjijYFosp7XNZhbrMPHbxNu26E+ZHsA7X+W6QYCPvmFGoDApbl2dDOFtuPc/KG85viHfRAdqWybILn+pmCt7dA2sX3cy2yQ6aFHDYrNtYdDhbbST34S193INDUfVpNKWs0BZ7e2tPaeEAQ9aV2quqxA=',
    'WUOdg6VVYdHi1zGyY2zHJon9dMRb8LE/UqWsZNo68EPoVmEY9hhke/eLhhO2zn7b9PExqwSiAHJjiHymrQUzmw==', 'USER'),

    # password: USER_2
    ('USER 2', 'user2@example.com',
    '9W3et1Yu+v/5m63/WA4fSJX902XAr7HJjUIVEZZjHOdGfR5m9bt5PfrpZLJIYGbidIxLAFKTrZcniiiD3DEyQU4UBj2Zx+ycHLeD+ST8GZMBULJZScbjiOoQ8ZJp8tOnL0j9JnYqGM/C2nSLWSuAzDSK9/XPrmWpLccu5AHHIvk=',
    'NfhfCUMYxeEX/UmLcS3pDPix6nPg+WEFQSXZa4Dj+obXLkzv2Wj73v0D/lrkUNDvJ6AyMpK6Wb3SxkOUIupo5Q==', 'USER'),

    # password: USER_3
    ('USER 3', 'user3@example.com',
    'HGCxbvubaa5XNPD0kQQxOPcvjUEtBldcmVZGev6Xnc5JzUcbQ5xms0LhTFfyvbnQGZ49cMFWcvF5tmNiFkEWOfeKwSjKttQy3Oa2F8dYsH5GHBDOJUwlhtX8DAZ7OLPg+jL9I3p2LacZQaOJNiprRRlr9JL8YyAUhZP7k9cASOw=',
    'g8m7CIfjD0uZlweidCWhANnrBNz3HTk1ADo+nnPv+dF9Qapl2ZftCDPBjQT/T7feQ8H6NRFZAeODA0n9yYm0ww==', 'USER'),

    # password: USER_4
    ('유저 4', 'user4@email.com',
    'aUlvOe6dXF6GXsOtkH+CWQNHyVounO9zdUS1y+d0lQBW87bto+TM8/DJC5KbYnbc7GL3FoY0/nEKZFUxuFASYH2jvOLIFv5uYj/2pAdUcYemgrpTE7eHKYO2OlvrpxWMzQPKdEfzrQLKh37SUaAL+64dU+2QXmV/1DL7RIGHA9U=',
    'fGQtLKDhULBFM1dczcF2D1n1UZF/ULD8Mz5MPxYhsWOUNR8I1zfPC+XVVcQ6CyyPMKY4o2XngfrHp3K7fvhAVQ==', 'USER'),

    # password: USER_5
    ('유저 5', 'user5@email.com',
    'eC78N0wDOTAskC9xoIoLl+QW86GrZK99ozUNWjiGATZPfAl3D09X3f02+DDi2rQJr0ngag31fDnoen0CORytaM2Tpq5kANeYTC/KoE0xB0S0sNxr83M85piqaGETUeSlCUsdF2/zIHhTI+0sDtOFuvjTIERBHG3sS0//aKXLMXU=',
    'Oe7/1yVMto0AfeDKJRuNKRRD8ZKLv2iwCVF4HnpAllZEn1NUBtAaOue9l70hciTExx0pGj8dOfdhidLE3dGPHQ==', 'USER'),

    # password: SleepUser6
    ('SleepUser 6', 'sleep@example.com',
    'f8MSiI5YA7IrmN8KUr0RRCwMcxo4lmn/kxLc16/equ27nZ9G/vLwj7CFWQQuuQMtxFfWWXCnQjD4IKRWHm/npsl9YJXG6b7UOeJ7rusg1nGruXUrQl6APTf5uPIQjhPN+illK7lU/YZ2bxhFs7feOTDzNey3KzZ+MvExm6varRk=',
    'RVxTEF/DnoaQWIXd4NqjNA/HWFXOiQoBZPD8Rn8WUk723yalxMzQBecdWdsVIRKlZXcgqvG78AUlNujPhhxmAA==', 'SLEEP'),

    # password: WITHDRAW_7
    ('탈퇴유저 7', 'withdraw@email.com',
    'NyZ/BKSQmbr7/aqNLtT2lvu/RIgy7ydFM2v+Th3z5v6OotPP8ze25mFCAzf7pafmgQYBqVy0eABVE3gV6xMsPFREefgbvWY5Bdrh7iSGPt0naw8E5ghV8rItztSIujXZvJuLeMP79ZWcAP8zeopeU/diFjL9sj3nzGefPTSWPuA=',
    'qJAyH2q9wmyXQTKKBD5fhy7DNxGBwv/NTMCgE5YppK++rLQ2exmvDs9ZmO/hR1SiAOCVgZdo3QcWHKrG+pRqWg==', 'WITHDRAW');

INSERT INTO USER_PERSONAL_INFO (USER_ID, GENDER, AGE)
VALUES  (1, 'MALE', 10),
        (2, 'FEMALE', 20),
        (3, 'MALE', 30);

INSERT INTO USER_PERSONAL_INFO (USER_ID, GENDER)
VALUES  (4, 'FEMALE'),
        (5, 'MALE');

INSERT INTO USER_PERSONAL_INFO (USER_ID, AGE)
VALUES  (6, 40),
        (7, 20),
        (8, 10);

# Dummy Surveys (10)
INSERT INTO SURVEY (AUTHOR_ID, TITLE, CONTENT)
VALUES  (1, 'Survey 1', 'Survey 1 Content'),
        (1, 'Survey 2', 'Survey 2 Content'),
        (2, 'Survey 3', 'Survey 3 Content'),
        (2, 'Survey 4', 'Survey 4 Content'),
        (3, 'Survey 5', 'Survey 5 Content'),
        (4, 'Survey 6', 'Survey 6 Content'),
        (5, 'Survey 7', 'Survey 7 Content'),
        (6, 'Survey 8', 'Survey 8 Content'),
        (7, 'Survey 9', 'Survey 9 Content'),
        (8, 'Survey 10', 'Survey 10 Content');

INSERT INTO SURVEY_OPTION (SURVEY_ID, CONTENT)
VALUES  (1, 'Content 1'),
        (1, 'Content 2'),
        (1, 'Content 3'),
        (1, 'Content 4'),
        (2, 'Content 1'),
        (2, 'Content 2'),
        (2, 'Content 3'),
        (2, 'Content 4'),
        (3, 'Content 1'),
        (3, 'Content 2'),
        (4, 'Content 1'),
        (4, 'Content 2'),
        (5, 'Content 1'),
        (5, 'Content 2'),
        (6, 'Content 1'),
        (6, 'Content 2'),
        (7, 'Content 1'),
        (7, 'Content 2'),
        (8, 'Content 1'),
        (8, 'Content 2'),
        (9, 'Content 1'),
        (9, 'Content 2'),
        (10, 'Content 1'),
        (10, 'Content 2');

# Dummy Hashtags (4)
INSERT INTO HASHTAGS (NAME)
VALUES  ('h1'), ('h2'), ('h3'), ('h4');

INSERT INTO SURVEY_HASHTAGS (SURVEY_ID, HASHTAG_ID)
VALUES  (1, 1), (1, 2), (1, 3), (1, 4);
