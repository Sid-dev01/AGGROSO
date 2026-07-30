export const getFeedbackByBatchId = async (db, batchId) => {
  return db.feedback.findMany({
    where: {
      batchId,
    },
    select: {
      id: true,
      feedbackText: true,
      source: true,
      userType: true,
      productArea: true,
      feedbackDate: true,
      rating: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAllThemes = async (db) => {
  return db.theme.findMany({
    select: {
      id: true,
      title: true,
      problemStatement: true,
      status: true,
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const findThemeByTitle = async (db, title) => {
  return db.theme.findUnique({
    where: {
      title,
    },
  });
};

export const createTheme = async (db, data) => {
  return db.theme.create({
    data,
  });
};

export const createThemeFeedbacks = async (db, mappings) => {
  return db.themeFeedback.createMany({
    data: mappings,
    skipDuplicates: true,
  });
};

export const getThemesForBatch = async (db, batchId) => {
  return db.theme.findMany({
    where: {
      feedbacks: {
        some: {
          feedback: {
            batchId,
          },
        },
      },
    },
    include: {
      feedbacks: {
        include: {
          feedback: true,
        },
      },
    },
  });
};