import React, { Fragment, useEffect, useState } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";
import { CdktfProject, SynthesizedStack } from "../../../lib";
import { ErrorComponent } from "./components/error";

interface CommonSynthConfig {
  targetDir: string;
  targetStack: string;
  jsonOutput: boolean;
}

type SynthOutputConfig = {
  jsonOutput: boolean;
  targetStackName: string;
  stacks: SynthesizedStack[];
};

interface SynthConfig extends CommonSynthConfig {
  synthCommand: string;
}

const SynthOutput = ({
  jsonOutput,
  stacks,
  targetStackName,
}: SynthOutputConfig): React.ReactElement => {
  return (
    <>
      {jsonOutput ? (
        <Box>
          <Text>
            {(
              stacks.find((stack) => stack.name === targetStackName) ||
              stacks[0]
            )?.content || "{}"}
          </Text>
        </Box>
      ) : (
        <Text>
          Generated Terraform code for the stacks:{" "}
          {stacks?.map((s) => s.name).join(", ")}
        </Text>
      )}
    </>
  );
};

export const Synth = ({
  targetDir,
  targetStack,
  synthCommand,
  jsonOutput,
}: SynthConfig): React.ReactElement => {
  const [stacks, setStacks] = useState<SynthesizedStack[] | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const project = new CdktfProject({
      targetDir,
      synthCommand,
      onUpdate: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    });

    project.synth().then(() => setStacks(project.stacks), setError);
  }, [setStacks, setError]);

  if (stacks !== undefined) {
    return (
      <Fragment>
        <Box>
          <SynthOutput
            targetStackName={targetStack}
            stacks={stacks}
            jsonOutput={jsonOutput}
          />
        </Box>
      </Fragment>
    );
  }

  if (error) return <ErrorComponent error={error} />;

  return (
    <Box>
      <Fragment>
        <Text color="green">
          <Spinner type="dots" />
        </Text>
        <Box paddingLeft={1}>
          <Text>Sythesizing...</Text>
        </Box>
      </Fragment>
    </Box>
  );
};
