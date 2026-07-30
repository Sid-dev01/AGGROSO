export const createUploadBatch = (db, data) => {
  return db.uploadBatch.create({
    data,
  });
};

export const createFeedbacks = (db, data) => {
  return db.feedback.createMany({
    data,
  });
};
