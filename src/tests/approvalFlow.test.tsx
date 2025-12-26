import { useDatasetStore } from "../store/datasetStore";
import { useApprovalStore } from "../store/approvalStore";

beforeEach(() => {
  useDatasetStore.setState({
    datasets: [
      {
        id: "ds-test",
        name: "测试集",
        description: "",
        createdAt: new Date().toISOString(),
        status: "Draft",
        files: []
      }
    ]
  });
  useApprovalStore.setState({ entries: [] });
});

it("transitions approval status", async () => {
  await useDatasetStore.getState().updateStatus("ds-test", "Submitted");
  await useApprovalStore
    .getState()
    .addEntry("ds-test", "Submitted", "user", "User", "提交");

  await useDatasetStore.getState().updateStatus("ds-test", "Approved");
  await useApprovalStore
    .getState()
    .addEntry("ds-test", "Approved", "reviewer", "Reviewer", "通过");

  const dataset = useDatasetStore.getState().datasets[0];
  expect(dataset.status).toBe("Approved");
  expect(useApprovalStore.getState().entries).toHaveLength(2);
});
