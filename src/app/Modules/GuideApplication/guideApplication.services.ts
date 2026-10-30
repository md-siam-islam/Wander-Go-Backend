import { JwtPayload } from "jsonwebtoken";
import { ApplicationStatus, IGuideApplication } from "./guideApplication.interface";
import { GuideApplication } from "./guideApplication.model";
import { User } from "../User/user.model";
import { Role } from "../User/user.interface";
import { QueryBuilder } from "../utils/QueryBulder";

const applyForGuide = async (payload: Partial<IGuideApplication>, decodedUser: JwtPayload) => {
  const userId = decodedUser.userId;

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  if (existingUser.role === Role.GUIDE) {
    throw new Error("You are already a certified Tour Guide");
  }

  // Check if there is an existing pending application
  const existingPending = await GuideApplication.findOne({
    user: userId,
    status: ApplicationStatus.PENDING,
  });

  if (existingPending) {
    throw new Error("You already have an application under review. Please wait for admin approval.");
  }

  const application = await GuideApplication.create({
    ...payload,
    user: userId,
    email: existingUser.email,
    status: ApplicationStatus.PENDING,
  });

  return application;
};

const getMyApplication = async (userId: string) => {
  const application = await GuideApplication.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .populate("reviewedBy", "name email");

  return application;
};

const getAllApplications = async (query: Record<string, string>) => {
  const searchFields = ["fullName", "email", "phone", "nidOrPassport"];

  const modelQuery = new QueryBuilder(
    GuideApplication.find()
      .populate("user", "name email picture phone role isActive")
      .populate("reviewedBy", "name email"),
    query
  );

  const applications = await modelQuery
    .search(searchFields)
    .filter()
    .sort()
    .field()
    .pagination();

  const [data, meta] = await Promise.all([
    applications.build(),
    modelQuery.Getmeta(),
  ]);

  return {
    data,
    meta,
  };
};

const reviewApplication = async (
  applicationId: string,
  payload: { status: ApplicationStatus; adminFeedback?: string },
  decodedAdmin: JwtPayload
) => {
  const application = await GuideApplication.findById(applicationId);
  if (!application) {
    throw new Error("Guide application not found");
  }

  application.status = payload.status;
  application.adminFeedback = payload.adminFeedback || (payload.status === ApplicationStatus.APPROVED ? "Application approved" : "Application rejected");
  application.reviewedBy = decodedAdmin.userId;
  application.reviewedAt = new Date();

  await application.save();

  // If approved, update user's role to GUIDE!
  if (payload.status === ApplicationStatus.APPROVED) {
    await User.findByIdAndUpdate(application.user, { role: Role.GUIDE });
  } else if (payload.status === ApplicationStatus.REJECTED) {
    // If rejected and currently guide, revert to USER
    const applicant = await User.findById(application.user);
    if (applicant && applicant.role === Role.GUIDE) {
      applicant.role = Role.USER;
      await applicant.save();
    }
  }

  const updatedApplication = await GuideApplication.findById(applicationId)
    .populate("user", "name email picture phone role isActive")
    .populate("reviewedBy", "name email");

  return updatedApplication;
};

const deleteApplication = async (applicationId: string) => {
  const result = await GuideApplication.findByIdAndDelete(applicationId);
  return result;
};

export const GuideApplicationServices = {
  applyForGuide,
  getMyApplication,
  getAllApplications,
  reviewApplication,
  deleteApplication,
};
