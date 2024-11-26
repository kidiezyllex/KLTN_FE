import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, FlaskConical, X } from "lucide-react";
import { TestType } from "../../../../lib/entity-types";

interface LabTestsFormProps {
  tests: TestType[];
  handleCreateRequestTest: () => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
}

export default function LabTestsForm({
  tests,
  handleCreateRequestTest,
  handleCancel,
  isLoading,
}: LabTestsFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTests, setSelectedTests] = useState<String[]>([]);
  const [reasonRequestTest, setReasonRequestTest] = useState("");
  const [testTypes, setTestTypes] = useState<TestType[]>([]);

  const filteredTests = tests.filter((test) =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestToggle = (testId: String) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground text-slate-600 dark:text-slate-300">
      <h3 className="text-md font-semibold self-center">Tạo xét nghiệm</h3>
      <div className="">
        <Input
          type="search"
          placeholder="Tìm kiếm nhanh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4"
        />
        <div className="rounded-md border p-4 grid grid-cols-2 gap-2 mb-4 dark:bg-slate-950 bg-white">
          {filteredTests.map((test) => (
            <Label
              key={test._id}
              className="flex items-center space-x-2 mb-2 p-2 border rounded-md cursor-pointer"
            >
              <Checkbox
                id={`test-${test._id}`}
                checked={selectedTests.includes(test._id)}
                onCheckedChange={() => handleTestToggle(test._id)}
              />
              <Label
                key={test._id}
                className="text-sm font-semibold cursor-pointer"
              >
                {test.testName}
              </Label>
            </Label>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Các xét nghiệm đã chọn:</h3>
          <div className="flex flex-row flex-wrap gap-4">
            {testTypes.map((test, index) => (
              <Badge
                variant={"secondary"}
                key={index}
                className="border border-slate-300 dark:border-none"
              >
                {test.testName}
              </Badge>
            ))}
          </div>
          <h3 className="text-sm font-semibold">Nhập lý do xét nghiệm:</h3>
          <Textarea
            required
            id="reasonRequestTest"
            name="reasonRequestTest"
            value={reasonRequestTest}
            onChange={(e) => setReasonRequestTest(e.target.value)}
            placeholder="Nhập lý do xét nghiệm..."
          />
        </div>
      </div>
      <div className="flex flex-row flex-grow gap-4 w-full justify-end mt-4 items-end">
        <Button variant="destructive" onClick={handleCancel}>
          Huỷ
          <X className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleCreateRequestTest}
          disabled={isLoading}
          className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              Đang xử lý
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Tạo xét nghiệm
              <FlaskConical className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
