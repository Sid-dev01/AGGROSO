export const getApprovedThemesForBatch = async (db, batchId) => {
  return db.theme.findMany({
    where: {
      status: "APPROVED",
      feedbacks: {
        some: {
          feedback: {
            batchId,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      problemStatement: true,
      feedbacks: {
        where: {
          feedback: {
            batchId,
          },
        },
        select: {
          feedback: {
            select: {
              id: true,
              feedbackText: true,
              source: true,
              userType: true,
              productArea: true,
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const createReport = async (db, data) => {
  return db.report.create({
    data,
    select: {
      id: true,
      batchId: true,
      report: true,
      createdAt: true,
    },
  });
};

export const getReportByBatchId = async (db, batchId) => {
  return db.report.findFirst({
    where: {
      batchId,
    },
    select: {
      id: true,
      batchId: true,
      report: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
