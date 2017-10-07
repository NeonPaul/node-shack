
INSERT INTO `posts` (
  `user_id`,
  `content`,
  `time`,
  `bitchingabout`
) VALUES(
  '1',
  'Hello this is a post',
  '2016-12-15 09:00:00',
  '0'
), (
  '1',
  'This is an even newer post',
  '2017-01-11 14:00:12',
  '0'
);


INSERT INTO `users` (
  `id`, `email`, `password`, `user`
) VALUES(
  1,
  'test@example.com',
  '$2a$08$1OCd5JyotUI6t.nb.2XFc.5.uRIWGSKP4WxD1MKs2C.DmPNRfTG6.',
  'TestUser'
), (
 2,
 'test2@example.com',
 '$2a$08$1OCd5JyotUI6t.nb.2XFc.5.uRIWGSKP4WxD1MKs2C.DmPNRfTG6.',
 'TestUser2'
)
