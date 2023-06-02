import http from "../http-common";

class AgentService {
  getAllAgent(agentName, activeOrUnActive) {
    return http.get(`agent/search?agentName=${agentName}&activeOrUnActive=${activeOrUnActive}`);
  }
  getAll() {
    return http.get(`agent`);
  }
  //dùng cái này cho cac câu truy vấn agent ở chỗ khác
  getAllCommon() {
    return http.get("agent/common");
  }
  getAllAgentUnique() {
    return http.get("agent/unique");
  }
  getAllAccountAgent(idAgent, fullName) {
    return http.get(`account-agent?idAgent=${idAgent}&fullName=${fullName}`);
  }
  getAccountAgentById(id) {
    return http.get(`/account-agent/${id}`);
  }
  getAccountAgentByIdAgent(id) {
    return http.get(`/account-agent/id-agent/${id}`);
  }
  updateAccountAgent(data) {
    return http.put(`/account-agent`, data);
  }
  deleteAccountAgent(id) {
    return http.delete(`/account-agent/${id}`);
  }
  updateAccountAgentActive(data) {
    return http.put(`/account-agent/active`, data);
  }
  updateAccountAgentActiveMany(data) {
    return http.put(`/account-agent/active-many`, data);
  }
  getAgentById(id) {
    return http.get(`/agent/${id}`);
  }
  getAgentSmsByIdAgent(idAgent) {
    return http.get(`/agent/add-sms-agent/${idAgent}`);
  }
  createAgent(data) {
    return http.post("/agent", data);
  }
  createAccountAgent(data) {
    return http.post("/account-agent", data);
  }
  updateAgent(id, data) {
    return http.put(`/agent/${id}`, data);
  }
  updateActiveMultiAgent(data) {
    return http.put(`/agent/active-multi-agent/`, data);
  }
  addSmsAgent(data) {
    return http.put(`/agent/add-sms-agent`, data);
  }
  delete(id) {
    return http.delete(`agent/${id}`);
  }
  findAgentBrand(pageNumber, maxPageItem, name) {
    return http.get(`/agent-brand/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&name=${name}`);
  }
  updateBrandOfAgent(id, data) {
    return http.put(`/agent-brand/agent-brand/${id}`, data);
  }
  findAdminOfSchool(id) {
    return http.get(`/agent-brand/find/${id}`);
  }
}

export default new AgentService();