import type { Topic } from "../types";

export const microprocessorTopics: Record<string, Topic[]> = {
  "intro-microprocessor": [
    { title: "Fundamentals of Microprocessors", subTopics: ["Definition and basic structure", "Evolution of microprocessors (4-bit to 64-bit)", "Classification based on architecture (RISC vs CISC)", "Applications of microprocessors", "Comparison with microcontrollers"] },
    { title: "Basic Components and Terminology", subTopics: ["ALU, control unit, registers", "System bus (address, data, control)", "Clock speed and instruction cycle", "Word size and data bus width", "Memory and I/O interfacing basics"] },
  ],
  "8085-microprocessor": [
    { title: "Architecture of 8085", subTopics: ["Block diagram and pin diagram", "Register organization (accumulator, flags)", "Flag register (Sign, Zero, Auxiliary Carry, Parity, Carry)", "Stack pointer and program counter", "Address and data bus multiplexing"] },
    { title: "Instruction Set and Addressing Modes", subTopics: ["Data transfer instructions (MOV, MVI, LDA, STA)", "Arithmetic instructions (ADD, SUB, INR, DCR)", "Logical instructions (ANA, ORA, XRA, CMP)", "Branch instructions (JMP, JZ, JNZ, CALL, RET)", "Addressing modes (direct, register, immediate, indirect)"] },
    { title: "Timing and Interrupts", subTopics: ["Instruction cycle, machine cycle, T-states", "Timing diagrams for opcode fetch, memory read/write", "Interrupts: TRAP, RST 7.5, RST 6.5, RST 5.5, INTR", "Interrupt service routine", "SIM and RIM instructions"] },
  ],
  "8086-microprocessor": [
    { title: "Architecture of 8086", subTopics: ["Block diagram and pin diagram", "Bus interface unit (BIU) and execution unit (EU)", "Register organization (general, segment, pointer, index)", "Memory segmentation (code, data, stack, extra)", "Physical address generation"] },
    { title: "Instruction Set and Addressing Modes", subTopics: ["Data transfer instructions (MOV, PUSH, POP, XCHG)", "Arithmetic and logical instructions", "String instructions (MOVS, CMPS, SCAS)", "Addressing modes (register, immediate, direct, indexed, based)", "Branch and loop instructions"] },
    { title: "Assembly Programming", subTopics: ["Assembly language syntax", "Assembler directives (DB, DW, DD, EQU, SEGMENT)", "Writing simple programs", "Debugging techniques", "DOS and BIOS interrupts"] },
  ],
  "basic-computer-architecture-design": [
    { title: "Computer Architecture Fundamentals", subTopics: ["Von Neumann architecture", "Harvard architecture", "Comparison of architectures", "CPU organization and components", "Instruction set architecture (ISA)"] },
    { title: "Bus Systems and Performance", subTopics: ["System bus types (address, data, control)", "Bus arbitration", "Bus standards (PCI, USB, SATA)", "Performance metrics (MIPS, FLOPS, CPI)", "Amdahl's law"] },
    { title: "Instruction Cycle", subTopics: ["Fetch-decode-execute cycle", "Micro-operations", "Hardwired vs microprogrammed control", "Instruction pipelining basics", "Performance improvement techniques"] },
  ],
  "microprogrammed-control-unit": [
    { title: "Control Unit Design", subTopics: ["Hardwired control unit", "Microprogrammed control unit", "Control memory organization", "Address sequencing", "Comparison of control unit types"] },
    { title: "Microinstructions", subTopics: ["Microinstruction format", "Horizontal vs vertical microinstructions", "Nanoprogramming", "Control store organization", "Microprogram sequencer"] },
  ],
  "central-processing-unit": [
    { title: "ALU Design", subTopics: ["Arithmetic logic unit structure", "Addition and subtraction circuits", "Multiplication algorithms (Booth's)", "Division algorithms", "Floating-point unit"] },
    { title: "Register Organization", subTopics: ["General purpose registers", "Special purpose registers", "Accumulator-based architecture", "Register-memory architecture", "Stack organization"] },
    { title: "Instruction Formats and Addressing", subTopics: ["Instruction formats (fixed, variable)", "Addressing modes", "RISC vs CISC characteristics", "Register windowing", "Instruction encoding"] },
  ],
  "computer-arithmetic": [
    { title: "Integer Arithmetic", subTopics: ["Addition and subtraction algorithms", "Booth's multiplication algorithm", "Restoring and non-restoring division", "Carry look-ahead adder", "Ripple carry adder"] },
    { title: "Floating-Point Arithmetic", subTopics: ["Floating-point representation", "IEEE 754 standard (single and double precision)", "Floating-point addition and subtraction", "Floating-point multiplication and division", "Normalization and rounding"] },
  ],
  "io-memory-organization": [
    { title: "Input/Output Organization", subTopics: ["I/O interfaces and controllers", "Programmed I/O", "Interrupt-driven I/O", "Direct memory access (DMA)", "I/O processors"] },
    { title: "Memory Organization", subTopics: ["Memory hierarchy", "Cache memory (direct, associative, set-associative)", "Virtual memory and paging", "Memory management unit (MMU)", "Secondary storage organization"] },
  ],
  "pipelining": [
    { title: "Pipeline Concepts", subTopics: ["Instruction pipeline basics", "Pipeline stages (fetch, decode, execute, memory, write-back)", "Throughput and speedup", "Pipeline hazards (structural, data, control)", "Data forwarding and bypassing"] },
    { title: "Advanced Pipelining", subTopics: ["Branch prediction techniques", "Superscalar processors", "VLIW architecture", "Multi-core processors", "Pipeline performance metrics"] },
  ],
};
