package derfeb.bloom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Role;
import derfeb.bloom.repo.EmployeeRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EmployeeResourceIntegrationTest {

	@Autowired
	private WebApplicationContext webApplicationContext;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

	@Autowired
	private EmployeeRepo employeeRepo;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).addFilters().build();
		employeeRepo.deleteAll();
	}

	@Test
	void testGetAllEmployees_ReturnsEmptyListWhenNoEmployees() throws Exception {
		mockMvc.perform(get("/employee"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(0)));
	}

	@Test
	void testAddEmployee_SuccessfullyCreatesEmployee() throws Exception {
		Employee employee = Employee.builder()
				.name("Test User")
				.email("test@example.com")
				.password("test123")
				.role(Role.ROLE_EMPLOYEE)
				.isActive(true)
				.build();

		mockMvc.perform(post("/employee")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(employee)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Test User"));
	}

	@Test
	void testGetEmployeeById_FindsExistingEmployee() throws Exception {
		Employee saved = employeeRepo.save(Employee.builder()
				.name("Jane Doe")
				.email("jane@example.com")
				.password("test123")
				.role(Role.ROLE_EMPLOYEE)
				.isActive(true)
				.employeeCode("EMP-123")
				.build());

		mockMvc.perform(get("/employee/{id}", saved.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Jane Doe"));
	}

	@Test
	void testUpdateEmployee_SuccessfullyUpdatesDetails() throws Exception {
		Employee existing = employeeRepo.save(Employee.builder()
				.name("Old Name")
				.email("old@example.com")
				.password("test123")
				.role(Role.ROLE_EMPLOYEE)
				.isActive(true)
				.employeeCode("EMP-456")
				.build());

		Employee update = Employee.builder()
				.id(existing.getId())
				.name("New Name")
				.email("new@example.com")
				.password("test123")
				.employeeCode(existing.getEmployeeCode())
				.role(Role.ROLE_MANAGER)
				.isActive(true)
				.build();

		mockMvc.perform(put("/employee")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(update)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("New Name"));
	}

	@Test
	void testDeleteEmployee_RemovesEmployee() throws Exception {
		Employee saved = employeeRepo.save(Employee.builder()
				.name("Delete Me")
				.email("delete@example.com")
				.password("test123")
				.role(Role.ROLE_EMPLOYEE)
				.isActive(true)
				.employeeCode("EMP-789")
				.build());

		mockMvc.perform(delete("/employee/{id}", saved.getId()))
				.andExpect(status().isOk());
	}
}
