const baseUrl = 'http://localhost:3000';

const apiPath = {
  auth: `${baseUrl}/auth`,
  users: `${baseUrl}/users`,
  companies: `${baseUrl}/companies`,
  vacancies: `${baseUrl}/vacancies`,
  resumes: `${baseUrl}/resumes`,
  applications: `${baseUrl}/applications`,
};

const authEndpoints = {
  register: () => `${apiPath.auth}/sign-in`,
  login: () => `${apiPath.auth}/login`,
  refreshToken: (refreshToken: string) =>
    `${apiPath.auth}/refresh/${refreshToken}`,
};

const usersEndpoints = {
  getById: (userId: string) => `${apiPath.users}/${userId}`,
  updateById: (userId: string) => `${apiPath.users}/${userId}`,
};

const companiesEndpoints = {
  add: () => `${apiPath.companies}`,
  updateById: (companyId: string) => `${apiPath.companies}/${companyId}`,
  getById: (companyId: string) => `${apiPath.companies}/${companyId}`,
};

const vacanciesEndpoints = {
  add: () => `${apiPath.vacancies}`,
  updateById: (vacancyId: string) => `${apiPath.vacancies}/${vacancyId}`,
  getById: (vacancyId: string) => `${apiPath.vacancies}/${vacancyId}`,
  archiveById: (vacancyId: string) =>
    `${apiPath.vacancies}/${vacancyId}/archive`,
  search: () => `${apiPath.vacancies}`,
};

const resumesEndpoints = {
  add: () => `${apiPath.resumes}`,
  updateById: (resumeId: string) => `${apiPath}/${resumeId}`,
  deleteById: (resumeId: string) => `${apiPath}/${resumeId}`,
  getById: (resumeId: string) => `${apiPath}/${resumeId}`,
};

const applicationsEndpoints = {
  add: () => `${apiPath.applications}`,
  updateById: (applicationId: string) =>
    `${apiPath.applications}/${applicationId}`,
  getById: (applicationId: string) =>
    `${apiPath.applications}/${applicationId}`,
  getByUserId: (userId: string) => `${apiPath.applications}/users/${userId}`,
  getByVacancyId: (vacancyId: string) =>
    `${apiPath.applications}/vacancies/${vacancyId}`,
};

export const endpoints = {
  auth: authEndpoints,
  users: usersEndpoints,
  companies: companiesEndpoints,
  resumes: resumesEndpoints,
  vacancies: vacanciesEndpoints,
  applications: applicationsEndpoints,
};
