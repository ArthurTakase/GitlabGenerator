import gitlab
from sys import argv
import urllib3

urllib3.disable_warnings()

class TicketManager():
    def __init__(self):
        # VARIABLES
        self.url = "https://gitlab.cg33.fr"
        self.token = argv[1] # à mettre dans les données du repo
        self.projectId = argv[2]
        self.branchName = argv[3]

        self.to = None
        try:
            self.destBranch = argv[4]
            if (self.destBranch == argv[5]) and (self.branchName ==  argv[6]): self.to = "PROD"
            elif self.destBranch ==  argv[6]: self.to = "DEV"
        except: self.to = "FEAT"

        print(f"TicketManager: {self.to}")

        self.tickets = self.branchName.split("#")[1:]

        # INIT GITLAB
        self.gl = gitlab.Gitlab(self.url, private_token=self.token, ssl_verify=False, api_version=4)
        self.gl.auth()
        try: self.project = self.gl.projects.get(self.projectId)
        except: self.project = self.gl.projects.get(int(self.projectId))

    def edit_ticket(self, ticketId, tags, state):
        try:
            issue = self.project.issues.get(int(ticketId))
            editable_issue = self.project.issues.get(issue.iid, lazy=True)
            editable_issue.labels = tags
            editable_issue.state_event = state
            editable_issue.save()
            print(f"Ticket {ticketId} edited")
        except:
            print(f"Ticket {ticketId} error")
    
    def update(self):
        if self.to == "PROD":
            allTickets = self.project.issues.list(state="opened", get_all=True)
            for ticket in allTickets:
                if "EN TEST" in ticket.labels:
                    self.edit_ticket(ticket.iid, [], "close")
        else :
            for ticket in self.tickets:
                if self.to == "DEV": self.edit_ticket(ticket, ["EN TEST"], "reopen")
                elif self.to == "FEAT": self.edit_ticket(ticket, ["EN COURS"], "reopen")
        self.project.save()

if __name__ == "__main__":
    TicketManager().update()