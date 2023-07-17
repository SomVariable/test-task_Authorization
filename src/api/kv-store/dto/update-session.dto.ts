import { PickType } from "@nestjs/swagger";
import { SaveSessionDto } from "./save-session.dto";

export class UpdateSessionDto extends PickType(SaveSessionDto, []) {
}