import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { mockGetComputedStyle, render } from "../utilities/test";
import { CodeBlock } from "./CodeBlock";

describe("<CodeBlock />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    vi.useRealTimers();
  });

  it("should render a code block", () => {
    render(
      <CodeBlock language="javascript" onLanguageChange={() => {}}>
        <CodeBlock.Header>Header</CodeBlock.Header>
        <CodeBlock.Snippet code={`hello javascript`} language="javascript" />
        <CodeBlock.Snippet code={`hello php`} language="php" />
      </CodeBlock>,
    );
    expect(screen.getByText("hello javascript")).toBeInTheDocument();
  });

  it("should support copy", async () => {
    const { user } = render(
      <CodeBlock language="javascript" onLanguageChange={() => {}}>
        <CodeBlock.Header>Header</CodeBlock.Header>
        <CodeBlock.Snippet code={`hello javascript`} language="javascript" />
        <CodeBlock.Snippet code={`hello php`} language="php" />
      </CodeBlock>,
    );

    Object.assign(window.navigator.clipboard, {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    });

    const copyBtn = screen.getByRole("button", { name: /copy code/i });
    await user.click(copyBtn);

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
      "hello javascript",
    );
  });

  it("should support language change", async () => {
    const handleLanguageChange = vi.fn();

    const { user } = render(
      <CodeBlock language="php" onLanguageChange={handleLanguageChange}>
        <CodeBlock.Header>Header</CodeBlock.Header>
        <CodeBlock.Snippet code={`hello javascript`} language="javascript" />
        <CodeBlock.Snippet code={`hello php`} language="php" />
      </CodeBlock>,
    );

    expect(screen.getByText("hello php")).toBeInTheDocument();

    const menuBtn = screen.getByRole("button", { name: /php/i });
    await user.click(menuBtn);

    const itemBtn = screen.getByRole("menuitem", { name: /node.js/i });
    await user.click(itemBtn);

    expect(handleLanguageChange).toBeCalledWith("javascript");
  });

  it("should support single language mode", async () => {
    render(
      <CodeBlock language="javascript" onLanguageChange={() => {}}>
        <CodeBlock.Header color="primary">Header</CodeBlock.Header>
        <CodeBlock.Snippet code={`hello javascript`} language="javascript" />
      </CodeBlock>,
    );
    expect(
      screen.queryByRole("button", { name: /javascript/i }),
    ).not.toBeInTheDocument();
  });

  it("should support header color", async () => {
    render(
      <CodeBlock language="javascript" onLanguageChange={() => {}}>
        <CodeBlock.Header color="primary">Header</CodeBlock.Header>
        <CodeBlock.Snippet code={`hello javascript`} language="javascript" />
      </CodeBlock>,
    );
    expect(screen.getByTestId("header")).toHaveAttribute(
      "class",
      expect.stringContaining("colorPrimary"),
    );
  });
});
