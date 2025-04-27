from conductor.client.automator.task_handler import TaskHandler
from conductor.client.configuration.configuration import Configuration
import worker  # noqa: F401  (registers the budget_extract worker)

def main():
    cfg = Configuration()
    handler = TaskHandler(configuration=cfg, scan_for_annotated_workers=True)
    handler.start_processes()

if __name__ == "__main__":
    main()
