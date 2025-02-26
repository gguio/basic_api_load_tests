from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def test_get_method(self):
      self.client.get("/api/test")

    @task
    def test_post_method(self):
      self.client.post("/api/test", { "data": "User request" })

