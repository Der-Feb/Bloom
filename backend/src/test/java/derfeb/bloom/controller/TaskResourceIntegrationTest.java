package derfeb.bloom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import derfeb.bloom.model.Employee;
import derfeb.bloom.model.Role;
import derfeb.bloom.model.Task;
import derfeb.bloom.model.TaskStatus;
import derfeb.bloom.repo.EmployeeRepo;
import derfeb.bloom.repo.TaskRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TaskResourceIntegrationTest {

	@Autowired
	private WebApplicationContext webApplicationContext;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

	@Autowired
	private TaskRepo taskRepo;

	@Autowired
	private EmployeeRepo employeeRepo;

	private Employee testManager;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).addFilters().build();
		taskRepo.deleteAll();
		employeeRepo.deleteAll();
		testManager = employeeRepo.save(Employee.builder()
				.name("Test Manager")
				.email("manager@example.com")
				.password("password123")
				.role(Role.ROLE_MANAGER)
				.isActive(true)
				.employeeCode("MGR-12345")
				.build());
	}

	@Test
	void testGetAllTasks_ReturnsEmptyListWhenNoTasks() throws Exception {
		mockMvc.perform(get("/task/all"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(0)));
	}

	@Test
	void testCreateTask_SuccessfullyCreatesTask() throws Exception {
		Task task = Task.builder()
				.title("Test Task")
				.description("Test Description")
				.taskDate(LocalDate.now().plusDays(1))
				.status(TaskStatus.PENDING)
				.createdBy(testManager)
				.build();

		mockMvc.perform(post("/task/add")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(task)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title").value("Test Task"));
	}

	@Test
	void testCreateTask_WithAssignedEmployees() throws Exception {
		Employee employee = employeeRepo.save(Employee.builder()
				.name("Assign Me")
				.email("assign@example.com")
				.password("password")
				.role(Role.ROLE_EMPLOYEE)
				.isActive(true)
				.employeeCode("EMP-67890")
				.build());

		Task task = Task.builder()
				.title("Assigned Task")
				.status(TaskStatus.PENDING)
				.taskDate(LocalDate.now())
				.createdBy(testManager)
				.assignedEmployees(Collections.singleton(employee))
				.build();

		mockMvc.perform(post("/task/add")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(task)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title").value("Assigned Task"));
	}

	@Test
	void testGetTaskById_FindsExistingTask() throws Exception {
		taskRepo.save(Task.builder()
				.title("Find Me")
				.description("Find this task")
				.taskDate(LocalDate.now())
				.status(TaskStatus.PENDING)
				.createdBy(testManager)
				.build());

		mockMvc.perform(get("/task/all"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(1)));
	}
}
