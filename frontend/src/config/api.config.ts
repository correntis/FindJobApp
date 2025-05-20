// const baseUrl = 'http://host.docker.internal/api';
const baseUrl = 'http://localhost/api';
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
  getByUserId: (userId: string) => `${apiPath.companies}/users/${userId}`,
};

const vacanciesEndpoints = {
  add: () => `${apiPath.vacancies}`,
  updateById: (vacancyId: string) => `${apiPath.vacancies}/${vacancyId}`,
  getById: (vacancyId: string) => `${apiPath.vacancies}/${vacancyId}`,
  getByCompanyId: (companyId: string) =>
    `${apiPath.vacancies}/companies/${companyId}`,
  archiveById: (vacancyId: string) =>
    `${apiPath.vacancies}/${vacancyId}/archive`,
  search: () => `${apiPath.vacancies}/search`,
  languages: () => `${apiPath.vacancies}/languages`
};

const resumesEndpoints = {
  add: () => `${apiPath.resumes}`,
  updateById: (resumeId: string) => `${apiPath.resumes}/${resumeId}`,
  deleteById: (resumeId: string) => `${apiPath.resumes}/${resumeId}`,
  getById: (resumeId: string) => `${apiPath.resumes}/${resumeId}`,
  getByUserId: (userId: string) => `${apiPath.resumes}/users/${userId}`,
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
  getByUserAndVacancy: (vacancyId: string, userId: string) =>
    `${apiPath.applications}/vacancies/${vacancyId}/users/${userId}`,
};

export const endpoints = {
  auth: authEndpoints,
  users: usersEndpoints,
  companies: companiesEndpoints,
  resumes: resumesEndpoints,
  vacancies: vacanciesEndpoints,
  applications: applicationsEndpoints,
};
