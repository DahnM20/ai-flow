class UserDetails:
    def __init__(self, id:str, email:str ):
        self.id = id
        self.email = email

    def __str__(self):
        return f"Id: {self.id}, Email: {self.email}"

    def get_id(self):
        return self.id

    def get_email(self):
        return self.email