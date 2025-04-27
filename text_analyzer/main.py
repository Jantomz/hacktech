from conductor.client.automator.task_handler import TaskHandler
from conductor.client.configuration.configuration import Configuration
import worker          # registers budget_extract
import graphs_worker   # registers budget_graph_recs   ← NEW

def main():
    cfg = Configuration()
    handler = TaskHandler(configuration=cfg, scan_for_annotated_workers=True)
    handler.start_processes()

if __name__ == "__main__":
    main()
